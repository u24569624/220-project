import React from 'react';

const CreateProject = () =>{
    const [isOpen, setIsOpen] = React.useState(false);

    return(
        <div id="Create">
            <button onClick={() => setIsOpen(true)}><span class="material-symbols-outlined">add</span></button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Repository</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repo-name">Repository Name</Label>
                  <Input
                    id="repo-name"
                    value={newRepo.name}
                    onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                    placeholder="awesome-project"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repo-description">Description</Label>
                  <Input
                    id="repo-description"
                    value={newRepo.description}
                    onChange={(e) => setNewRepo({ ...newRepo, description: e.target.value })}
                    placeholder="A brief description of your project"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repo-language">Language</Label>
                  <Select value={newRepo.language} onValueChange={(value) => setNewRepo({ ...newRepo, language: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Add Repository
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
    );
} 

export default CreateProject;