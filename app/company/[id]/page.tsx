"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Card, CardBody, CardHeader, Divider, Link, Chip, Button, Spacer, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { fetcher } from "@/lib/fetcher";
import COUNTRIES from "@/lib/countries";
import { AddJobFormData, addJobSchema } from "@/lib/schema/addJobSchema";

export default function CompanyDetailsPage() {
  const { id } = useParams();
  const { data: company, error, isLoading } = useSWR<Company>(`/api/company/${id}`, fetcher);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
  } = useForm<AddJobFormData>({
    resolver: zodResolver(addJobSchema),
    defaultValues: {
      title: "",
      country: "Singapore",
    },
  });

  useEffect(() => {
    if (isModalOpen) {
      setFocus("title");
    }
  }, [isModalOpen, setFocus]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading company data</div>;
  if (!company) return <div>Company not found</div>;

  const handleAddThisJob = handleSubmit((data) => {
    console.log("Form data", data);

    // TODO: add this job to the company using server action and mutation
    handleCloseModal();
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="mx-auto max-w-[1024px] p-4">
      {/* Company Name and URL */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">{company.company_name}</h1>
        <Link isExternal showAnchorIcon className="text-primary" href={company.company_url}>
          {company.company_url}
        </Link>
      </div>

      {/* Dashboard */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <Card>
              <CardBody>
                <p className="text-lg font-semibold">Total Jobs</p>
                <p className="text-3xl">42</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-lg font-semibold">Active Applications</p>
                <p className="text-3xl">18</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-lg font-semibold">Interviews Scheduled</p>
                <p className="text-3xl">5</p>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>

      {/* Open Positions with modal */}
      <div className="mb-4 flex justify-between">
        <h2 className="text-2xl font-semibold">Open Positions</h2>
        <Button className="rounded-full border-2 border-green-700 px-4 py-2 text-green-700 transition-colors duration-300 hover:bg-green-700 hover:text-white" variant="flat" onPress={handleOpenModal}>
          Add a new job
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalContent>
          <form onSubmit={handleAddThisJob}>
            <ModalHeader className="flex flex-col gap-1">Add New Job</ModalHeader>
            <ModalBody>
              <Controller
                control={control}
                name="title"
                render={({ field }) => <Input {...field} errorMessage={errors.title?.message} isInvalid={!!errors.title} label="Job Title" placeholder="Enter job title" variant="bordered" />}
              />
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <Select {...field} defaultSelectedKeys={[field.value]} errorMessage={errors.country?.message} label="Country" placeholder="Select a country">
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Add Job
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Job Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[1, 2, 3].map((job) => (
          <Card key={job}>
            <CardBody>
              <h3 className="mb-2 text-xl font-semibold">Software Engineer Intern Summer 2025</h3>
              <p className="mb-4 text-default-500">Singapore • Ongoing</p>
              <Chip className="mb-4" color="secondary" variant="flat">
                New
              </Chip>
              <Spacer y={2} />
              <Button size="sm">View More</Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
